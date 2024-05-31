import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

interface VariableConfigAttributes {
  key: string;
  value?: number;
}

export interface VariableConfigInput extends Required<VariableConfigAttributes> {}
export interface VariableConfigOutput extends Required<VariableConfigAttributes> {}

class VariableConfig extends Model<VariableConfigAttributes, VariableConfigInput> implements VariableConfigAttributes {
  public key!: string;
  public value!: number;
}

VariableConfig.init({
  key: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  value: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: false,
  sequelize: connection,
  underscored: false,
  tableName: 'variable_configs',
});

export default VariableConfig;
