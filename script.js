let editingLicenseId = null
let renewingLicenseId = null
let deletingLicenseId = null

let licenses = JSON.parse(localStorage.getItem("licenses")) || []

function generateCode() {

    return 'XXXX-XXXX-XXXX'.replace(/X/g, function () {

        return Math.floor(Math.random() * 16).toString(16).toUpperCase()

    })

}

function save() {
    localStorage.setItem("licenses", JSON.stringify(licenses))
}

function addLicense() {

    let name = document.getElementById("name").value
    let duration = parseInt(document.getElementById("duration").value)

    if (!name || !duration) return alert("Enter name and duration")

    let created = new Date()

    let expiry = new Date()
    expiry.setDate(expiry.getDate() + duration)

    let license = {

        id: Date.now(),
        name: name,
        duration: duration,
        activation: generateCode(),
        created: created,
        expiry: expiry

    }

    licenses.push(license)

    save()

    render()

}

function deleteLicense(id) {
    licenses = licenses.filter(l => l.id !== id)
    save()
    render()
}

function openDeleteModal(id){
  deletingLicenseId = id
  document.getElementById("deleteModal").style.display = "flex"
}

function closeDeleteModal(){
  document.getElementById("deleteModal").style.display = "none"
}

function confirmDelete(){
  licenses = licenses.filter(l => l.id !== deletingLicenseId)
  save()
  render()
  closeDeleteModal()
}

function renewLicense(id) {
    renewingLicenseId = id
    document.getElementById("renewDays").value = ""
    document.getElementById("renewModal").style.display = "flex"
}

function saveRenew() {
    let license = licenses.find(l => l.id === renewingLicenseId)
    let days = parseInt(document.getElementById("renewDays").value)

    if (!days || days <= 0) {
        alert("Please enter a valid number of days")
        return
    }

    // Extend expiry date
    let expiry = new Date(license.expiry)
    expiry.setDate(expiry.getDate() + days)
    license.expiry = expiry

    // Generate a new activation code
    license.activation = generateCode()

    save()
    render()
    closeRenewModal()
}

function closeRenewModal() {
    document.getElementById("renewModal").style.display = "none"
}

function editLicense(id) {
    let license = licenses.find(l => l.id === id)
    editingLicenseId = id
    document.getElementById("editName").value = license.name
    document.getElementById("editExpiry").value =
        new Date(license.expiry).toISOString().split("T")[0]
    document.getElementById("editModal").style.display = "flex"
}

function saveEdit() {

    let license = licenses.find(l => l.id === editingLicenseId)
    license.name = document.getElementById("editName").value
    license.expiry = new Date(document.getElementById("editExpiry").value)

    save()
    render()
    closeModal()
}



function closeModal() {
    document.getElementById("editModal").style.display = "none"
}

function render() {

    let table = document.getElementById("licenseTable")

    table.innerHTML = ""

    licenses.forEach(l => {

        let today = new Date()

        let expiry = new Date(l.expiry)

        let status = expiry < today ? "Expired" : "Active"

        let row = `

                <tr>

                <td>${l.name}</td>

                <td>${l.activation}</td>

                <td>${expiry.toDateString()}</td>

                <td>
                
                <span class="${status === "Expired" ? "status-expired" : "status-active"}">
                    ${status}
                </span>

                </td>

                <td>

                <button onclick="editLicense(${l.id})">Edit</button>

                <button onclick="renewLicense(${l.id})">Renew</button>

                <button class="delete-btn" onclick="openDeleteModal(${l.id})">Delete</button>

                </td>

                </tr>

        `

        table.innerHTML += row

    })

}

render()