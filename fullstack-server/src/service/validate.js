export const ValidateData = async (data)=>{
    // async ຖ້າຟັນຊັ່ນນີ້ບໍ່ສຳເລັບຈະບໍ່ໄປຕໍ່
    return Object.keys(data).filter((key) => !data[key]);
}