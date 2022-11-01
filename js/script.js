const $ = (selector) => document.querySelector(selector)

// AGREGAR OPERACIONES A UN ARRAY DE OBJETOS

let operations = []

const operationsInfo = () => {
    const description = $("#description").value
    const amount = $("#amount").value
    const type = $("#type").value
    const selectedCategory = $("#selectCategory").value
    const date = $("#date").value
    const id = operations.length + 1
    return {
        id,
        description,
        amount,
        type,
        selectedCategory,
        date
    }
}


const generateTableOperations = () => {
    $("#table").innerHTML = ""
    operations.map(operation => {
        const { id, description, selectedCategory, date, amount } = operation
        $("#table").innerHTML += `
            
            <tr>
                <td class="pl-0 pr-10 mt-0 pt-0 text-lg font-bold">${description}</td>
                <td class="mt-0 pt-0 pl-10 text-xs ">${selectedCategory}</td>
                <td class="mt-0 pt-0 pl-10 text-sm">${date}</td>
                <td class="mt-0 pt-0 pl-12 text-lg text-red-500 font-bold">${amount}</td>
                <td class="pl-8 mt-0 pt-0 text-xs"><button id="btnEditOperation" class="mr-4" onclick="operationEdit(${id})">Editar</button><button id="btnDeleteOperation" class="mr-4" onclick="operationDelete(${id})">Eliminar</button></td>
            </tr>
            
        `
    })
}

const cleanNewOperationsForm =()=>{
    $("#form-new-operation").classList.add("hidden")
}
//tabla de operaciones ya realizadas, que aparezca la tabla
const showTable= ()=>{ 
    $("#doneOperations").classList.remove("hidden")
    $("#aside").classList.remove("hidden")
}


$("#addOperation").addEventListener("click", () => {
    operations.push(operationsInfo())
    console.log(operations)
    generateTableOperations()
    cleanNewOperationsForm()
    showTable()
})

/*------------------------------------------------------------------*/

const findOperation = (id) => {
    return operations.find(operation => operation.id === id)
}

//
// const addDataId = () =>{
//     $("#btnEditOperation").setAttribute("data-id", id)
//     $("#btnDeleteOperation").setAttribute("data-id", id)
// }
const operationEdit = (id) => {
    $("#editOperationsForm").classList.remove("hidden")
    $("#doneOperations").classList.add("hidden")
    cleanAside()
    const changeOperation = findOperation(id)
    $("#editDescription").value = changeOperation.description
    $("#editAmount").value = changeOperation.amount
    $("#editType").value = changeOperation.type
    $("#editSelectedCategory").value = changeOperation.selectedCategory
    $("#editDate").value =  changeOperation.date
    $("#btnEditOperation").setAttribute("data-id", id)

  
}
const operationDelete = (id)=>{
    $("#btnDeleteOperation").setAttribute("data-id", id)
    
}


//remover operacion, delete

const removeOperation = (id) => {
    return operations.filter(operation => operation.id !== parseInt(id))
}
// console.log($("#btnEditOperation"))
// $("#btnEditOperation").addEventListener("click", () => {
//     $("#editOperationsForm").classList.remove("hidden")
// })


// $("#btnDeleteOperation").addEventListener("click", () => {
//     const operationId = $("#btnDeleteOperation").getAttribute("data-id")
//     removeOperation(operationId)
//     //$form.classList.add("d-none")
//     generateTableOperations(removeOperation(operationId))
// })



// generateBalance = ()=>{

// }



//let categorys = ["Comida", "Servicios", "Salidas", "Educación", "Transporte", "Trabajo"]


// evento para que aparezca el form al presionar +nueva operación(maca)
// const cleanFrontPage =()=> $("#front-page").innerHTML = ""

 const cleanAside =()=> $("#aside").classList.add("hidden")
 const cleanFrontPage =()=> $("#frontPage").classList.add("hidden")


$("#btnNewOperations").addEventListener("click", () => {
    cleanAside()
    cleanFrontPage()
    $("#form-new-operation").classList.remove("hidden")
})