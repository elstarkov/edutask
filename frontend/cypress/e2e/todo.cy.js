describe("Test todo", () => {
    // define variables that we need on multiple occasions
    let uid; // user id
    let name; // name of the user (firstName + ' ' + lastName)
    let email; // email of the user
    let todosDesc;

    before(function () {
        // create a fabricated user from a fixture
        cy.fixture("user.json").then((user) => {
            cy.request({
                method: "POST",
                url: "http://localhost:5000/users/create",
                form: true,
                body: user,
            }).then((response) => {
                uid = response.body._id.$oid;
                name = user.firstName + " " + user.lastName;
                email = user.email;
            });
        });

        cy.fixture("task.json").then((task) => {
            task.userid = uid;
            cy.request({
                method: "POST",
                url: "http://localhost:5000/tasks/create",
                form: true,
                body: task,
            }).then((response) => {
                todosDesc = response.body[0].todos[0].description;
            });
        });
    });

    beforeEach(function () {
        // enter the main main page
        cy.visit("http://localhost:3000");

        //login
        cy.contains("div", "Email Address")
            .find("input[type=text]")
            .type("mon.doe@gmail.com")
            .should("contain.text", "");

        cy.get("form").submit();

        //click the title overlay
        cy.get(".title-overlay").click();
    });

    it("Users enters description of todo item in empty form and submits", () => {
        cy.get('.inline-form > [type="text"]').type("Need to do this");

        //submit the new todo-item
        cy.get('.inline-form > [type="submit"]').click();

        //check that todo-item was added to the list
        cy.get("li.todo-item").should("contain.text", "Need to do this");
    });

    it("Users tries to submit an empty description, the 'Add'-button should be disabled", () => {
        cy.get("form.inline-form")
            .find("input[type=submit]")
            .should("be.disabled");
    });

    it("Try to mark a todo as 'done' and check if text is struck through", () => {
        cy.get(".todo-list .todo-item")
            .contains(todosDesc)
            .parent()
            .find(".checker.unchecked")
            .click();

        cy.get(".todo-list .todo-item")
            .contains(todosDesc)
            .should(
                "have.css",
                "text-decoration",
                "line-through solid rgb(49, 46, 46)"
            );
    });

    it("Unmark checked item and check that it's not struck through anymore", () => {
        cy.get(".todo-list .todo-item")
            .contains(todosDesc)
            .parent()
            .find(".checker.checked")
            .click();

        cy.get(".todo-list .todo-item")
            .contains(todosDesc)
            .should(
                "not.have.css",
                "text-decoration",
                "line-through solid rgb(49, 46, 46)"
            );
    });

    it("User clicks the X symbol behind the description of the todo item", () => {
        cy.get(".todo-list .todo-item")
            .contains(todosDesc)
            .parent()
            .find(".remover")
            .click();

        cy.get("li.todo-item").should("not.contain.text", todosDesc);
    });

    after(function () {
        // clean up by deleting the user from the database
        cy.request({
            method: "DELETE",
            url: `http://localhost:5000/users/${uid}`,
        }).then((response) => {
            cy.log(response.body);
        });
    });
});
