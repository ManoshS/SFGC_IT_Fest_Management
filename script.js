document.addEventListener('DOMContentLoaded', () => {
    const eventSelect = document.getElementById('eventSelect');
    const studentDetails = document.getElementById('studentDetails').getElementsByTagName("tbody")[0];
    document.getElementById('loader').style.display = 'none';


    // Function to fetch and display student details
    async function fetchStudentDetails(eventId) {
        try {
            const response = await fetch(`https://getpantry.cloud/apiv1/pantry/1c4f9119-32de-4766-af1f-01141acb4e6d/basket/${eventId}`);
            const students = await response.json();
            //studentDetails.innerHTML = '';
            console.log(students)

            traverseCheck(students, studentDetails, eventId)

        } catch (error) {


            const newRow = studentDetails.insertRow();
            const Cell = newRow.insertCell(0);
            Cell.textContent = "No entries Found"
            console.error('Error fetching student details:', error);
        }
        document.getElementById('loader').style.display = 'none';
    }

    // Event listener for dropdown change
    eventSelect.addEventListener('change', () => {
        document.getElementById('loader').style.display = "block";
        const eventId = eventSelect.value;
        const table = document.getElementById('studentDetails');
        const tbody = table.getElementsByTagName('tbody')[0];
        if (tbody) {
            while (tbody.rows.length > 1) {
                tbody.deleteRow(tbody.rows.length - 1);
            }
        }

        if (eventId) {
            fetchStudentDetails(eventId);
        } else {
            studentDetails.innerHTML = '';
        }

    });


});


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}



function traverseCheck(data, studentDetails, eventId) {

    // const card = document.createElement('span');
    // card.className = 'card';
    // studentDetails.appendChild(card);
    const newRow = studentDetails.insertRow();


    let i = 1;
    let j = 0;
    if (Object.entries(data).length < 1) {

        const newRow = studentDetails.insertRow();
        const Cell = newRow.insertCell(0);
        Cell.textContent = "No entries Found"
        return;
    }
    for (let info in data) {

        if (data.hasOwnProperty(info))
            if (typeof data[info] === 'object' && !Array.isArray(data[info])) {
                i++;
                console.log(i)
                studentDetails.style.display = "block";
                traverseCheck(data[info], studentDetails, eventId);



            } else {

                const Cell = newRow.insertCell(j);

                Cell.textContent = data[info];
                // let content = document.createElement("td");
                // content.innerHTML = `${data[info]} `;




                if (info === "TeamName") {

                    newRow.dataset.data = data[info];
                }
                console.log(info + "  :  " + data[info])
                j++;
            }

    }


    let deleteB = document.createElement("button");
    deleteB.className = "btn btn-danger";
    deleteB.innerHTML = "Reject"
    deleteB.style.width = "100px"
    if (newRow.cells.length !== 0) {
        const Cell = newRow.insertCell(j);
        Cell.appendChild(deleteB);
    }





    if (i === 1) {

        deleteB.onclick = () => {
            let ch = window.confirm("DO you want to delete this record")
            if (ch) {
                document.getElementById('loader').style.display = "block";
                newRow.style.display = "none"



                fetch(`https://getpantry.cloud/apiv1/pantry/1c4f9119-32de-4766-af1f-01141acb4e6d/basket/${eventId}`)
                    .then(response => {

                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }

                        return response.json();
                    })
                    .then(data => {
                        console.log(newRow.dataset.data);
                        delete data[newRow.dataset.data]
                        const csrfToken = getCookie('csrf_token');
                        fetch(`https://getpantry.cloud/apiv1/pantry/1c4f9119-32de-4766-af1f-01141acb4e6d/basket/${eventId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': csrfToken
                            },
                            body: JSON.stringify(data)
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok ' + response.statusText);
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log('Data:', data);
                            })
                            .catch(error => {
                                console.error('There has been a problem with your fetch operation in PUT:', error);
                            });



                    }).catch(error => {

                        console.error("There is Error in GET", error);
                    })
                document.getElementById('loader').style.display = "none";
            }

        }
    }
}

function deleteRow(rowIndex) {
    if (table.rows[rowIndex]) {
        table.deleteRow(rowIndex);
    }
}

function deleteAll() {
    let ch = window.confirm("DO you want to delete all records")
    if (ch) {
        const eventSelect = document.getElementById('eventSelect');
        const eventId = eventSelect.value;

        const table = document.getElementById('studentDetails');
        const tbody = table.getElementsByTagName('tbody')[0];

        if (tbody) {
            while (tbody.rows.length > 1) {
                tbody.deleteRow(tbody.rows.length - 1);
            }
        }
        fetch(`https://getpantry.cloud/apiv1/pantry/1c4f9119-32de-4766-af1f-01141acb4e6d/basket/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                return response.json();
            })
            .then(data => { }).catch(error => { console.log(error) });

    }
}

