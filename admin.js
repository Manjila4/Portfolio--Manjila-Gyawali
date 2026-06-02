async function loadContacts() {
    try {
        const response = await fetch("http://localhost:5050/api/contacts");

        const contacts = await response.json();

        const tbody = document.querySelector("#contactTable tbody");

        contacts.forEach(contact => {
            const row = `
                <tr>
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.service}</td>
                    <td>${contact.message}</td>
                </tr>
            `;

            tbody.innerHTML += row;
        });

    } catch (error) {
        console.log(error);
    }
}

loadContacts();