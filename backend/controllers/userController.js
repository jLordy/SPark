import { sql } from "../config/db.js"

export const getUsers = async (req, res) => {
    try {
        const users = await sql`
            SELECT * FROM users
            ORDER BY user_id ASC
        `;
        
        console.log("fetched users", users);
        res.status(200).json({success:true, data:users});
    } catch (error) {
        
    }
} 
export const createUser = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      position,
      vehicle_type,
      plate_number,
      id_picture,
      preferences,
      is_approved,
      role,
    } = req.body;

    const newUser = await sql`
    INSERT INTO users (
      first_name,
      middle_name,
      last_name,
      position,
      vehicle_type,
      plate_number,
      id_picture,
      preferences,
      is_approved,
      role
    ) VALUES (
      ${first_name},
      ${middle_name},
      ${last_name},
      ${position},
      ${vehicle_type},
      ${plate_number},
      ${id_picture},
      ${preferences},
      ${is_approved ?? false},
      ${role ?? "user"}
    )
    RETURNING *;
  `;
    console.log("New User Added:", newUser);

    res.status(201).json({
      sucess: "true",
      data: newUser[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getUser = async (req, res) => {
    const {id } = req.params
    
    try {
        const user = await sql`
            SELECT * FROM users WHERE user_id=${id}
        `;

        res.status(200).json({ success:true, data: user[0]})
    } catch (error) {
        console.log("Error in getUser function", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    middle_name,
    last_name,
    position,
    vehicle_type,
    plate_number,
    id_picture,
    preferences,
    is_approved,
    role,
  } = req.body;

  try {
    const updatedUser = await sql`
      UPDATE users
      SET 
        first_name   = COALESCE(${first_name}, first_name),
        middle_name  = COALESCE(${middle_name}, middle_name),
        last_name    = COALESCE(${last_name}, last_name),
        position     = COALESCE(${position}, position),
        vehicle_type = COALESCE(${vehicle_type}, vehicle_type),
        plate_number = COALESCE(${plate_number}, plate_number),
        id_picture   = COALESCE(${id_picture}, id_picture),
        preferences  = COALESCE(${preferences}, preferences),
        is_approved  = COALESCE(${is_approved}, is_approved),
        role         = COALESCE(${role}, role)
      WHERE user_id = ${id}
      RETURNING *;
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, data: updatedUser[0] });
  } catch (error) {
    console.error("Error in updateUser function", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await sql`
            DELETE FROM users WHERE user_id=${id}
            RETURNING *
        `;
        
         if(deletedUser.length === 0){
            return res.status(404).json({
                success: false,
                message: "User not found"    
            });
        }
        res.status(200).json({ success: true, data: deletedUser[0] });
    } catch (error) {
        console.log("Error in deleteUser function", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};