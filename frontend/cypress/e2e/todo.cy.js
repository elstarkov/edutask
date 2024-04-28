
describe('Adding task to authenticated user',  
    {
        env: {
        taskDesc: "Stuff to do!",
        },
    },
        () => {
    // define variables that we need on multiple occasions
    let uid, email, taskId 

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

        // Create aliases if an element is used more than one time.
        cy.get(".inline-form").children("[type=text]").as("taskFormText")
        cy.get(".inline-form").children("[type=submit]").as("taskFormSubmit")
        cy.get(".todo-item").children("span.checker").eq(0).as("todoItemChecker")
    })

    it('Add task', () => {
        cy.get("@taskFormText").type(Cypress.env("taskDesc")).then(() => {
            cy.get("@taskFormText").should("have.value", Cypress.env("taskDesc"))
            cy.get("@taskFormSubmit").should("be.visible").click()
        })
        cy.get(".todo-item").children("span.editable").contains(Cypress.env("taskDesc"))
        cy.get("span.remover").eq(0).click()
    })

    it('Add empty task', () => {
        cy.get("@taskFormText").should("be.empty")
        cy.get("@taskFormSubmit").should("be.disabled")
    })

    it('Mark todo as done or undone', () => {
        cy.get("@todoItemChecker").should("have.class", "unchecked")
            .click().should("have.class", "checked")

        cy.get("@todoItemChecker").should("have.class", "checked")
            .click().should("have.class", "unchecked")
    })

    it('Remove todo', () => {
        cy.get(".todo-item").children("span.remover").eq(0)
            .click().should("not.exist")
    })

    after(function () {
        // Clean up by deleting the user from the database
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
        //     cy.log("taskid->",taskId)
        //     cy.log(response.body)
        // })
    })
})
