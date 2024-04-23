
describe('Adding task to authenticated user', () => {
    // define variables that we need on multiple occasions
    let uid // user id
    let name // name of the user (firstName + ' ' + lastName)
    let email // email of the user

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
                name = user.firstName + ' ' + user.lastName
                email = user.email
                cy.wait(500)
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:5000/tasks/create',
                    form: true,
                    body:[
                            {
                                'title': "hej", 
                                'description': "a desc",
                                'userid': response.body._id,
                                'url': "https://www.youtube.com/watch?v=eaIvk1cSyG8&ab_channel=ThumbsUpForRockAndRoll",
                                'todos': ['Eat a snack']
                            }
                        ]
                }).then((response) => {
                    console.log(response.body);
                })
            })
        })
    })

    beforeEach(function () {
        // enter the main main page
        cy.visit('http://localhost:3000')
    })

    it('starting out on the landing screen', () => {
        
        // make sure the landing page contains a header with "login"
        cy.get('#email')
            .should('contain.text', '')
    })

    after(function () {
        // clean up by deleting the user from the database
        cy.request({
            method: 'DELETE',
            url: `http://localhost:5000/users/${uid}`
        }).then((response) => {
            cy.log(response.body)
        })
    })
})
