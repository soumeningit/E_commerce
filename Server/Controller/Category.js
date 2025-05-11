const { connect } = require('../Routes/CategoryRoute');
const { createCategories } = require('../Utils/CreateTable');
const Connection = require('../Utils/DBConnect');

exports.createCategory = async (req, res) => {
    try {
        console.log("INSIDE CREATE CATEGORY ....");
        const connection = await Connection();

        console.log("req.body : ", req.body);

        const isCategoryTablePresent = await createCategories(connection);
        if (!isCategoryTablePresent) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });

        }
        const { name, description, parent_category, userId } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const [category] = await connection.execute(
            `INSERT INTO categories (category_name, categori_desc, parent_category, created_by) VALUES (?, ?, ?, ?)`,
            [name, description, parent_category, userId]
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
        const pool = await Connection();
        const connection = await pool.getConnection();
        const { id } = req.query;
        console.log("req.query : ", req.query);
        console.log("Category Id : ", id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Category id is required"
            });
        }

        const query = `
                        SELECT
                            p.id AS product_id,
                            p.product_name,
                            p.product_price,
                            p.product_mrp,
                            p.initial_quantity,
                            p.current_stk,
                            p.category_id,
                            p.image AS product_image,
                            p.created_at AS creation_time,
                            c.category_name,
                            c.categori_desc,
                            c.parent_category,
                            pd.id AS product_description_id,
                            pd.short_desc,
                            pd.medium_desc,
                            pd.long_desc,
                            u.id AS seller_id,
                            u.firstName,
                            u.lastName,
                            u.email
                        FROM 
                            product_details AS p
                        JOIN 
                            categories AS c ON p.category_id = c.id
                        JOIN 
                            product_description AS pd ON pd.product_id = p.id
                        JOIN 
                            users AS u ON u.id = p.created_by
                        WHERE 
                            p.category_id = ?;`;

        const [items] = await connection.execute(query, [id]);
        if (!items.length) {
            return res.status(404).json({
                success: false,
                message: "No items found for this category"
            });
        }

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

