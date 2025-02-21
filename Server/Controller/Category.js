const { connect } = require('../Routes/CategoryRoute');
const Connection = require('../Utils/DBConnect');

exports.createCategory = async (req, res) => {
    try {
        console.log("INSIDE CREATE CATEGORY ....");
        const connection = await Connection();
        const [table] = await connection.execute(`SHOW TABLES LIKE 'categories'`);
        if (table.length === 0) {
            const query = `CREATE TABLE categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                categori_name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                parent_category_id INT DEFAULT NULL,
                FOREIGN KEY (parent_category_id) REFERENCES categories(id)
            )`;
            const [table] = await connection.execute(query);
            if (table.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Table not created"
                });
            }
            console.log("Table created successfully");
        }
        const { name, description, parent_category_id } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const [category] = await connection.execute(
            `INSERT INTO categories (categori_name, description, parent_category_id) VALUES (?, ?, ?)`,
            [name, description, parent_category_id]
        );
        if (category.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Category not created"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        });
    } catch (error) {
        console.log("Error in createCategory", error);
    }
};

exports.getCategories = async (req, res) => {
    try {
        console.log("INSIDE GET CATEGORIES ....");
        const connection = await Connection();
        const [rows] = await connection.execute(`SELECT * FROM categories`);
        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "No categories found"
            });
        };

        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.log("Error in getCategories", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const connection = await Connection();
        const { id, name = null, description = null, parent_category_id = null } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category id is required"
            });
        }
        const [updatedResult] = await connection.execute(`UPDATE categories SET categori_name = ?, description = ?, parent_category_id = ? WHERE id = ?`, [name, description, parent_category_id, id]);
        if (updatedResult.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Category Updation Failed, Category not updated"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category updated successfully"
        });
    } catch (error) {
        console.log("Error in updateCategory", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const connection = await Connection();
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category id is required"
            });
        }
        const [deletedResult] = await connection.execute(`DELETE FROM categories WHERE id = ?`, [id]);
        if (deletedResult.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Category Deletion Failed, Category not deleted"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleteCategory", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.findItemsByCategory = async (req, res) => {
    try {
        console.log("INSIDE FIND ITEMS BY CATEGORY ....");
        const connection = await Connection();
        const { id } = req.query;
        console.log("req.query : ", req.query);
        console.log("Category Id : ", id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category id is required"
            });
        }
        const [items] = await connection.execute(
            `SELECT id, product_id, product_name, description, product_image, product_mrp FROM Products WHERE category_id = ?`,
            [id]
        );
        if (!items.length) {
            return res.json({
                success: false,
                message: "No items found"
            });
        };

        console.log("Items : ", items);

        return res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        console.log("Error in findItemsByCategory", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

