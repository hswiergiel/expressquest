const database = require("./database");

const getUsers = (req, res) => {
    database
        .query("select * from users")
        .then(([users]) => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        })
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    database
        .query("select * from users where id = ?", [id])
        .then(([users]) => {
            users[0] ? res.status(200).json(users[0]) : res.status(404).send("Not found")
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        })
}

const postUser = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;
    database
        .query(
            "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?,?,?,?,?)",
            [firstname, lastname, email, city, language]
        )
        .then(([result]) => {
            res.location(`/api/users/${result.insertID}`).sendStatus(201);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error saving the user');
        })
}

const putUser = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;
    const id = parseInt(req.params.id);
    database
        .query(
            "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language= ? WHERE id = ?",
            [firstname, lastname, email, city, language, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error updating the user');
        });
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    database
        .query(
            "DELETE from users WHERE id = ?",
            [id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting the user");
        });

}

module.exports = {
    getUsers,
    getUserById,
    postUser,
    putUser,
    deleteUser
}