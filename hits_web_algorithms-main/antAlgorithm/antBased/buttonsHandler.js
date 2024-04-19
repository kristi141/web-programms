export function returnToOriginalStage(){
    document.getElementById("ant-addVertexButton").textContent = "Добавить вершину ВЫКЛ";
    document.getElementById("ant-deleteVertexButton").textContent = "Удалить вершину ВЫКЛ";
}

export function changeAddButton(){
    document.getElementById("ant-deleteVertexButton").textContent = "Удалить вершину ВЫКЛ";
    document.getElementById("ant-addVertexButton").textContent = "Добавить вершину ВКЛ";
}

export function changeDeleteButton(){
    document.getElementById("ant-addVertexButton").textContent = "Добавить вершину ВЫКЛ";
    document.getElementById("ant-deleteVertexButton").textContent = "Удалить вершину ВКЛ";
}

export function offAllButtons() {
    document.getElementById("ant-findPathButton").disabled = true;
    document.getElementById("ant-addVertexButton").disabled = true;
    document.getElementById("ant-deleteVertexButton").disabled = true;
    document.getElementById("ant-clearButton").disabled = true;
    document.getElementById("getLines").disabled = true;
    document.getElementById("ant-inputRange").disabled = true;
    document.getElementById("ant-iterationRange").disabled = true;
    document.getElementById("ant-rhoRange").disabled = true;
    document.getElementById("warning").style.display = "block";
}

export function onAllButtons(flag) {
    document.getElementById("ant-findPathButton").disabled = false;
    document.getElementById("ant-addVertexButton").disabled = false;
    document.getElementById("ant-deleteVertexButton").disabled = false;
    document.getElementById("ant-clearButton").disabled = false;
    document.getElementById("getLines").disabled = false;
    document.getElementById("ant-inputRange").disabled = false;
    document.getElementById("ant-iterationRange").disabled = false;
    document.getElementById("ant-rhoRange").disabled = false;
    document.getElementById("warning").style.display = "none";
    if(!flag) {
        document.getElementById("done").style.display = "block";
        setTimeout(() => {
            document.getElementById("done").style.display = "none";
        }, 1500);
    }
}
