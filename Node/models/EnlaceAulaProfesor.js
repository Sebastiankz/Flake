import AulaModel from './AulaModel.js';
import {ProfesorModel} from './UserModelTemp.js';

// Relacionar Aula con Profesor
AulaModel.belongsTo(ProfesorModel, { foreignKey: 'id_profesor' });
ProfesorModel.hasMany(AulaModel, { foreignKey: 'id_profesor' });

export { AulaModel, ProfesorModel };
