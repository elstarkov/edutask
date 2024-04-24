
describe('Adding task to authenticated user', () => {
    // define variables that we need on multiple occasions
    let uid, name, email // name of the user (firstName + ' ' + lastName)

    before(function () {
        // create a fabricated user from a fixture
        cy.fixture('user.json')
            .then((user) => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:5000/users/create',
                form: true,
                body: user
            }).then((response) => {
                uid = response.body._id.$oid
                console.log(uid,"adssdadas,");
                name = user.firstName + ' ' + user.lastName
                email = user.email

            cy.request({
                method: 'POST',
                url: 'http://localhost:5000/tasks/create',
                form: true,
                body:
                        {
                            'title': "hej", 
                            'description': "a desc",
                            'userid': uid,
                            'url': "https://www.youtube.com/watch?v=eaIvk1cSyG8&ab_channel=ThumbsUpForRockAndRoll",
                            'todos': 'Eat a snack'
                        }
                    
            }).then((response) => {
                console.log(response.body);
            })
            })
        })
    })
    

    beforeEach(function () {
        cy.visit('http://localhost:3000')
        cy.get('#email').type(email);
        cy.get("form").eq(0).submit() // Send first form that is found
    })

    it('starting out on the landing screen', () => {
        
        // make sure the landing page contains a header with "login"
    })

    after(function () {
        // clean up by deleting the user from the database
        console.log("asdasdD",uid);
        cy.request({
            method: 'DELETE',
            url: `http://localhost:5000/users/${uid}`
        }).then((response) => {
            cy.log(response.body)
        })
    })
})
