const $ = (selector) => document.querySelector(selector)

// AGREGAR OPERACIONES A UN ARRAY DE OBJETOS

let operations = []

const operationsInfo = () => {
    const description = $("#description").value
    const amount = $("#amount").value
    const type = $("#type").value
    const selectedCategory = $("#selectCategory").value
    const date = $("#date").value
    return {
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
        const { description, selectedCategory, date, amount } = operation
        $("#table").innerHTML += `
            
            <tr>
                <td class="pl-0 pr-10 mt-0 pt-0 text-lg font-bold">${description}</td>
                <td class="mt-0 pt-0 pl-10 text-xs ">${selectedCategory}</td>
                <td class="mt-0 pt-0 pl-10 text-sm">${date}</td>
                <td class="mt-0 pt-0 pl-12 text-lg text-red-500 font-bold">${amount}</td>
                <td class="pl-8 mt-0 pt-0 text-xs"><a class="mr-4">Editar<a/><a class="mr-4">Eliminar<a/></td>
            </tr>
            
        `
    })
}

$("#addOperation").addEventListener("click", () => {
    operations.push(operationsInfo())
    console.log(operations)
    generateTableOperations()
})

/*------------------------------------------------------------------*/

// generateBalance = ()=>{

// }



//let categorys = ["Comida", "Servicios", "Salidas", "Educación", "Transporte", "Trabajo"]