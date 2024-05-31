import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import Driver from "./Driver";

interface DriverAttendanceAttributes {
  id?: number,
  driver_code: string,
  attendance_date: Date,
  attendance_status: boolean,
}

export interface DriverAttendanceInput extends Optional<DriverAttendanceAttributes, 'id'> {}
export interface DriverAttendanceOutput extends Required<DriverAttendanceAttributes> {}

class DriverAttendance extends Model<DriverAttendanceAttributes, DriverAttendanceInput> implements DriverAttendanceAttributes {
  public id!: number;
  public driver_code!: string;
  public attendance_date!: Date;
  public attendance_status!: boolean;
}

DriverAttendance.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  driver_code: {
    allowNull: false,
    type: DataTypes.STRING
  },
  attendance_date: {
    allowNull: false,
    type: DataTypes.DATEONLY
  },
  attendance_status: {
    allowNull: false,
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: false,
  sequelize: connection,
  underscored: false,
  tableName: 'driver_attendances',
});

// DriverAttendance.belongsTo(Driver, {
//   foreignKey: 'driver_code'
// });

export default DriverAttendance;
