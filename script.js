document.addEventListener('DOMContentLoaded', () => {
    const eventSelect = document.getElementById('eventSelect');
    const studentDetails = document.getElementById('studentDetails');
    document.getElementById('loader').style.display = 'none';


    // Function to fetch and display student details
    async function fetchStudentDetails(eventId) {
        try {
            const response = await fetch(`https://getpantry.cloud/apiv1/pantry/1c4f9119-32de-4766-af1f-01141acb4e6d/basket/${eventId}`);
            const students = await response.json();
            studentDetails.innerHTML = '';
            console.log(students)

            traverseCheck(students, studentDetails, eventId)

        } catch (error) {
            studentDetails.innerHTML = "No entries Found"
            console.error('Error fetching student details:', error);
        }
        document.getElementById('loader').style.display = 'none';
    }

    // Event listener for dropdown change
    eventSelect.addEventListener('change', () => {
        document.getElementById('loader').style.display = "block";
        const eventId = eventSelect.value;
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

    const card = document.createElement('div');
    card.className = 'card';
    studentDetails.appendChild(card);

    let i = 1;
    if (Object.entries(data).length < 1) {
        card.innerHTML = "No entries Found"
        return;
    }
    for (let info in data) {

        if (data.hasOwnProperty(info))
            if (typeof data[info] === 'object' && !Array.isArray(data[info])) {
                i++;
                studentDetails.style.display = "block";
                traverseCheck(data[info], studentDetails, eventId);



            } else {
                let content = document.createElement("div");
                content.innerHTML = `<p class="card-title"> ${info} :${data[info]}</p>`
                card.appendChild(content);
                if (info === "TeamName") {
                    card.dataset.data = data[info];
                }
                console.log(info + "  :  " + data[info])
            }

    }

    if (i === 1) {
        let accept = document.createElement("button");
        accept.className = "btn btn-success";
        accept.innerHTML = "Accept"
        accept.style.width = "100px"


        card.appendChild(accept)
        let deleteB = document.createElement("button");
        deleteB.className = "btn btn-danger";
        deleteB.innerHTML = "Reject"
        deleteB.style.width = "100px"

        card.appendChild(deleteB)
        accept.onclick = () => {
            accept.style.display = "none"
            deleteB.style.display = "none"
        }
        deleteB.onclick = () => {
            document.getElementById('loader').style.display = "block";
            card.style.display = "none"



            fetch(`https://getpantry.cloud/apiv1/pantry/1c4f9119-32de-4766-af1f-01141acb4e6d/basket/${eventId}`)
                .then(response => {

                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }

                    return response.json();
                })
                .then(data => {
                    console.log(card.dataset.data);
                    delete data[card.dataset.data]
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


function deleteAll() {
    const eventSelect = document.getElementById('eventSelect');
    const eventId = eventSelect.value;
    studentDetails.style.display = "none"
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

