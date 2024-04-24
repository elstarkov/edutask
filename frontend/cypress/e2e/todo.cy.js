
describe('Adding task to authenticated user',  
    {
        env: {
        taskDesc: "Stuff to do!",
        },
    },
        () => {
    // define variables that we need on multiple occasions
    let uid, name, email, taskId // name of the user (firstName + ' ' + lastName)

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
                
            cy.fixture('task.json').then((task) => {
                task.userid = uid
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:5000/tasks/create',
                    form: true,
                    body: task
                    }).then((response) => {
                        taskId = response.body[0]._id.$oid
                    })
                })
            })
        })
    })
    

    beforeEach(function () {
        cy.visit('http://localhost:3000')
        cy.get('#email').should("not.be.disabled").type(email);
        cy.get("form").eq(0).submit() // Send first form that is found
        cy.get(".container-element > a").eq(0).click()

        // Create aliases.
        cy.get(".inline-form").as("taskForm")
    })

    it('Add task', () => {

        cy.get("@taskForm").children("[type=text]").type(Cypress.env("taskDesc")).then(() => {
            cy.get("@taskForm").children("[type=text]").should("have.value", Cypress.env("taskDesc"))
            cy.get("@taskForm").children("[type=submit]").should("be.visible").click()
        })
        cy.get(".todo-item").children("span.editable").contains(Cypress.env("taskDesc"))
    })

    after(function () {
        // clean up by deleting the user from the database
        cy.request({
            method: 'DELETE',
            url: `http://localhost:5000/users/${uid}`
        }).then((response) => {
            cy.log(response.body)
        })
        // cy.request({
        //     method: 'DELETE',
        //     url: `http://localhost:5000/tasks/byid/${taskId}`
        // }).then((response) => {
        //     cy.log(response.body)
        // })
    })
})
