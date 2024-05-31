import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import ShipmentCost from "./ShipmentCost";
import DriverAttendance from "./DriverAttendance";


interface DriverAttributes {
  id?: number,
  driver_code: string,
  name: string
}

export interface DriverInput extends Optional<DriverAttributes, 'id'> {}
export interface DriverOutput extends Required<DriverAttributes> {}

class Driver extends Model<DriverAttributes, DriverInput> implements DriverAttributes {
  public id!: number;
  public driver_code!: string;
  public name!: string;
  public ShipmentCost?: ShipmentCost;
}

Driver.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  driver_code: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  }
}, {
  timestamps: false,
  sequelize: connection,
  underscored: false,
  tableName: 'drivers',
});

Driver.belongsTo(ShipmentCost, { foreignKey: "driver_code", targetKey: 'driver_code' });
Driver.belongsTo(DriverAttendance, { foreignKey: "driver_code", targetKey: 'driver_code' });

export default Driver;