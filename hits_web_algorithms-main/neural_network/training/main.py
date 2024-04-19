import json
import random
import gzip
import pickle
import numpy as np
#  https://www.susu.ru/sites/default/files/laboratornaya_rabota.pdf
def sigmoid(z):
    return 1.0/(1.0+np.exp(-z))

def deltaSigmoid(z):
    return sigmoid(z)*(1-sigmoid(z))

class Network():
    def __init__(self, sizes, data = None):
        self.num_layers = len(sizes)
        self.sizes = sizes
        self.biases = [np.random.randn(y, 1) for y in sizes[1:]]
        self.weights = [np.random.randn(y, x) for x, y in zip(sizes[:-1], sizes[1:])]
        if (data != None):
            self.biases = np.array(data["biases"], dtype=object)
            self.weights = np.array(data["weights"], dtype=object)

    def vectorized_result(self, j):
        e = np.zeros((10, 1))
        e[j] = 1.0
        return e

    def getdata(self):
        with gzip.open('mnist.pkl.gz', 'rb') as f:
            tr_d, va_d, te_d = pickle.load(f, encoding="latin1")
        training_inputs = [np.reshape(x, (784, 1)) for x in tr_d[0]]
        training_results = [self.vectorized_result(y) for y in tr_d[1]]
        training_data = list(zip(training_inputs, training_results))
        return training_data

    def feedforward(self, a):
        for bias, weight in zip(self.biases, self.weights):
            a = sigmoid(np.dot(weight, a) + bias)
        return a

    def recognising(self, input):
        vectorised = self.feedforward(input)
        maxInd, maximum = 0
        for i in range(len(vectorised)):
            if (vectorised[i][0] > maximum):
                maximum = vectorised[i][0]
                maxInd = i
        return maxInd

    def training(self, epochs, mini_batch_size, grad_step):
        training_data = self.getdata()
        n = len(training_data)
        for j in range(epochs):
            random.shuffle(training_data)
            mini_batches = [training_data[k:k + mini_batch_size] for k in range(0, n, mini_batch_size)]
            for mini_batch in mini_batches:
                self.update(mini_batch, grad_step)
            print("Epoch {0}".format(j))
        print("Training completed")

    def update(self, mini_batch, grad_step):
        # вычисляем градиент как сумму градиентов отдельных элементов, деленную на количество элементов в партии
        grad_b = [np.zeros(np.array(b).shape) for b in self.biases]
        grad_w = [np.zeros(np.array(w).shape) for w in self.weights]
        for x, y in mini_batch:
            delta_grad_b, delta_grad_w = self.backprop(x, y)
            grad_b = [gb + dgb for gb, dgb in zip(grad_b, delta_grad_b)]
            grad_w = [gw + dgw for gw, dgw in zip(grad_w, delta_grad_w)]
        # изменяем веса и смещения
        self.weights = [w - (grad_step / len(mini_batch)) * gw for w, gw in zip(self.weights, grad_w)]
        self.biases = [b - (grad_step / len(mini_batch)) * gb for b, gb in zip(self.biases, grad_b)]

    def backprop(self, x, y):
        grad_b = [np.zeros(np.array(b).shape) for b in self.biases]
        grad_w = [np.zeros(np.array(w).shape) for w in self.weights]
        # строим матрицы всех данных нейросети, полученых при feedforward
        # z - нейрон до активации
        activation = x
        activations = [x]  # список всех активаций
        z_vectors = []
        for i in range(len(self.weights)):
            z = np.dot(self.weights[i], activation) + self.biases[i]
            z_vectors.append(z)
            activation = sigmoid(z)
            activations.append(activation)
        # вычисляем локальный градиент, delta - вектор частных производных на последнем слое
        delta = self.deltaCost(activations[-1], y) * deltaSigmoid(z_vectors[-1])
        # градиент смещений = локальный градиент
        grad_b[-1] = delta
        # градиент весов = локальный градиент * активации на предыдущем слое
        grad_w[-1] = np.dot(delta, activations[-2].transpose())

        # для каждого слоя, с кнца последовательно начинаем высчитывать градиент
        for l in range(2, self.num_layers):
            z = z_vectors[-l]
            sp = deltaSigmoid(z)
            delta = np.dot(np.array(self.weights[-l + 1]).transpose(), delta) * sp
            grad_b[-l] = delta
            grad_w[-l] = np.dot(delta, activations[-l - 1].transpose())
        return (grad_b, grad_w)

    def deltaCost(self, output_activations, y):
        return (output_activations - y)

def run():
    with open("data.json") as f:
        data = json.load(f)
    layers = [784, 28, 10]
    net = Network(layers, data)
    net.training(1000, 10, 2)
    exportData = {"weights": [net.weights[i].tolist() for i in range(len(layers) - 1)],
                  "biases": [net.biases[i].tolist() for i in range(len(layers) - 1)]}
    jsonString = json.dumps(exportData, ensure_ascii=False)
    with open("data.txt", "w") as f:
        f.write(jsonString)


if __name__ == '__main__':
    run()