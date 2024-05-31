import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

interface ShipmentAttributes {
  shipment_no: string,
  shipment_date: Date,
  shipment_status: 'RUNNING' | 'DONE' | 'CANCELLED',
}

// export interface ShipmentInput extends Optional<ShipmentAttributes, 'shipment_no'> {}
export interface ShipmentInput extends Required<ShipmentAttributes> {}
export interface ShipmentOutput extends Required<ShipmentAttributes> {}

class Shipment extends Model<ShipmentAttributes, ShipmentInput> implements ShipmentAttributes {
  public shipment_no!: string;
  public shipment_date!: Date;
  public shipment_status!: 'RUNNING' | 'DONE' | 'CANCELLED';
}

Shipment.init({
  shipment_no: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  shipment_date: {
    allowNull: false,
    type: DataTypes.DATEONLY
  },
  shipment_status: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [['RUNNING', 'DONE', 'CANCELLED']]
    }
  }
}, {
  timestamps: false,
  sequelize: connection,
  underscored: false,
  tableName: 'shipments',
});

export default Shipment;
