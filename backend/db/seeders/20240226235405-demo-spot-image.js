'use strict';
const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const spotImagesData = [
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711326901/samples/Spots/fb8e1035-e6e5-4f6d-aa8f-08c14e287cdf_qcidif.jpg',
        preview: true 
      },

      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711326852/samples/Spots/6612e201-99aa-42a3-a5fe-464ec3673abc_fyrovp.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711326979/samples/Spots/e8522b2f-8754-40c9-a139-2c0cd9839c39_ysxpwd.jpg',
        preview: false
      },

      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711326941/samples/Spots/f46fd720-a8e6-4bdd-92eb-0eac79c26904_kfg346.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327020/samples/Spots/bb46d140-dbd5-46c3-951e-9eb92a1da5b0_iuezje.jpg',
        preview: false
      },

      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327192/samples/Spots/3a6e9b62-da6b-4a76-af0b-003eafc7b8ec_s7r58l.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327263/samples/Spots/de98929c-9b31-4278-bbb8-e23afe2636ed_q0pve6.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327418/samples/Spots/7c7fa93c-3361-41a5-b581-1445bad6fb00_bkw79a.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327445/samples/Spots/330fb1bd-3d03-4df5-8f08-1e683c7e92a9_gioswf.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327486/samples/Spots/86e38329-6339-4a7b-ae87-6d2e65c175b9_ig3hda.jpg',
        preview: false
      },

      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327581/samples/Spots/10d2c21f-84c2-46c5-b20b-b51d1c2c971a_wlgyrq.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327609/samples/Spots/e3beaf52-13ab-44ed-bbfa-56ccf43bab98_ugaqro.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327767/samples/Spots/db17fce1-4ad0-45d8-8d7b-ba5ccdfe770c_hd0jbt.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327648/samples/Spots/858b29eb-53f3-4707-87a6-444f4375f888_qipk8f.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327648/samples/Spots/858b29eb-53f3-4707-87a6-444f4375f888_qipk8f.jpg',
        preview: false
      },

      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327952/samples/Spots/1e16f2f4-1256-44cb-a0f2-85aa57672a45_etwecj.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327970/samples/Spots/4f0cdef6-d0be-423b-9b03-7663e28c49f7_j8gx5r.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328051/samples/Spots/32ef68c3-d815-45cb-b3c5-97f7eb38d842_bxpxbd.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328095/samples/Spots/fdbf3164-fabe-4918-bf21-91c710239ad6_w8zcsl.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328071/samples/Spots/c0d09dcc-409a-4923-a5df-4855a5f2a58a_ivjl85.jpg',
        preview: false
      }, 
      {
        spotId: 5,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328249/samples/Spots/935bf463-f066-47a3-86b5-efaa6a2cb293_dgy59g.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328304/samples/Spots/dd84d98c-f2c1-4e17-a2fd-8bb9c48f5440_mbxv0w.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328266/samples/Spots/e6673a44-514a-4d8c-97df-dc4de23aab76_saa94l.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328278/samples/Spots/4d3b2cd6-9769-47fd-ba1f-56ddbe1305ab_rjz0l0.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328266/samples/Spots/e6673a44-514a-4d8c-97df-dc4de23aab76_saa94l.jpg',
        preview: false
      },

      {
        spotId: 6,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328437/samples/Spots/1a5b645e-a657-4cd8-872e-964529bef4c3_qgzpju.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328460/samples/Spots/914ae2e0-c8d1-4a2e-ba6c-868b9c465c05_ibl7vw.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328520/samples/Spots/95632d54-d5e1-4c6b-bb64-e3c6dc14134d_lblowr.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328507/samples/Spots/a0d244e4-484c-44de-b724-52cd7db3b7e5_dno93i.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328497/samples/Spots/232bf0df-06d9-450d-9c1a-33bc43769517_cgyn1k.jpg',
        preview: false
      },

      {
        spotId: 7,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328765/samples/Spots/c3e32620-6a4d-483c-b85f-ef92beeb7033_ny6yaz.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328776/samples/Spots/0c3be554-ef86-4654-8cfc-4186839d5201_oy7gh8.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328809/samples/Spots/fdfc48cb-cd9a-4779-be35-b8a5ba7bb4bc_vgtute.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328819/samples/Spots/bdb5def7-bf04-4d24-a979-deac06d37e04_lfo2qo.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328532/samples/Spots/8f22ec8d-6d0b-460f-840b-1eb915a54c8d_fa8sq6.jpg',
        preview: false
      },

      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328995/samples/Spots/9cbabddb-e191-417c-87e1-5262ec9da3c7_pcpflk.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328977/samples/Spots/f7d1ee1e-ba06-4a02-9c17-5a5b5e9395e6_awjuvt.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711329008/samples/Spots/e4a6eeb9-f531-4809-bccb-e96e86b577b7_kqdxtf.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711329032/samples/Spots/518b0167-b46d-401c-ac83-5ab530ea5014_kcmcb7.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711329074/samples/Spots/802bf4da-bf71-471f-a8ab-4cef8152b7be_wwofbv.jpg',
        preview: false
      },
      
    ];
      await SpotImage.bulkCreate(spotImagesData, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'spotImages';
    await queryInterface.bulkDelete(options, null, {});
  }
};
