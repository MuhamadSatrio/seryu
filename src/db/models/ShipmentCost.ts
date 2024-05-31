import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import Shipment from "./Shipment";

interface ShipmentCostAttributes {
  id?: number,
  driver_code: string,
  shipment_no: string,
  total_costs: number,
  cost_status: 'PENDING' | 'CONFIRMED' | 'PAID',
}

export interface ShipmentCostInput extends Optional<ShipmentCostAttributes, 'id'> {}
export interface ShipmentCostOutput extends Required<ShipmentCostAttributes> {}

class ShipmentCost extends Model<ShipmentCostAttributes, ShipmentCostInput> implements ShipmentCostAttributes {
  public id!: number;
  public driver_code!: string;
  public shipment_no!: string;
  public total_costs!: number;
  public cost_status !: 'PENDING' | 'CONFIRMED' | 'PAID';
}

ShipmentCost.init({
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
  shipment_no: {
    allowNull: false,
    type: DataTypes.STRING
  },
  total_costs: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  cost_status : {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [['PENDING', 'CONFIRMED', 'PAID']]
    }
  }
}, {
  timestamps: false,
  sequelize: connection,
  underscored: false,
  tableName: 'shipment_costs',
});

ShipmentCost.belongsTo(Shipment, { foreignKey: "shipment_no", targetKey: 'shipment_no' });

export default ShipmentCost;
