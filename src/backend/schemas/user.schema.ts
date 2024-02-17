import { SaleEmployeeRole, UserRole } from '../../shared/enums/UserRole.enum'

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: UserRole, required: true },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    department_name: { type: String, required: true },
    sub_role: {
      type: String,
      enum: SaleEmployeeRole,
      required: function () {
        return this.role === UserRole.SALE_EMPLOYEE
      }
    }
  },
  { timestamps: true }
)

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

export default UserModel
