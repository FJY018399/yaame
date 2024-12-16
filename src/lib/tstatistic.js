// import tStatistic from 'tstatistic';
// import { getUid } from './device';

// tStatistic.init({
//     app_key: 92430003
// });

// const suid = getUid() ? getUid() : '';

// export default {
//     send(event, md, c_id, c_m, pos, args) {
//         if (!event) {
//             console.error('没有必须参数event');
//             return;
//         }
//         if (!md) {
//             console.error('没有必须参数md');
//             return;
//         }
//         if (!c_id) {
//             console.error('没有必须参数c_id');
//             return;
//         }

//         tStatistic.send({
//             event: event,
//             md: md,
//             c_id: c_id,
//             c_m: c_m ? c_m : '',
//             pos: pos ? pos : '',
//             args: args ? Object.assign(args, { suid }) : { suid }
//         });
//     }
// };