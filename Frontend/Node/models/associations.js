import InstitucionModel from './InstitucionModel.js';
import AulaModel from './AulaModel.js';
import { ProfesorModel } from './UserModelTemp.js';


// Definir las asociaciones
InstitucionModel.hasMany(AulaModel, { foreignKey: 'cod_DANE' });
AulaModel.belongsTo(InstitucionModel, { foreignKey: 'cod_DANE' });

ProfesorModel.hasMany(AulaModel, { foreignKey: 'id_profesor' });
AulaModel.belongsTo(ProfesorModel, { foreignKey: 'id_profesor' });

export { InstitucionModel, AulaModel, ProfesorModel };
