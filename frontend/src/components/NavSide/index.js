import AdDice from "../AdDice";
import Catgelogue from "../Catgelogue";
import Filter from "../Filter";
import ShiftTable from "../ShiftTable";

export default function NavSide() {

    const  diceImages = [
        "http://fit.tdc.edu.vn/files/large/1ef6e6ed65b839dad1640c119455c0e9.png",
        "http://fit.tdc.edu.vn/files/large/9074660121941d6a934e36ad7df35c75.png",
        "http://fit.tdc.edu.vn/files/large/b0070817becbb1a18ee7479b13fcde8a.png",
        "http://fit.tdc.edu.vn/files/large/930de6f96d22d26c7c7b47ad3c64f93b.png",
    ];

    const catelogueE = {
        title: "FIT - TDC catalogue English",
        image: "http://fit.tdc.edu.vn/files/large/4c86f5a025b1dd41e57b20af40e75138.jpg",
        link: "https://view.publitas.com/tdc/fit-tdc-catalogue-2018-english/",
    };

    const catelogueJP = {
        title: "FIT - TDC catalogue Japanese",
        image: "http://fit.tdc.edu.vn/files/large/f2b90876148cec1cc3a928c4564b7ae0.jpg",
        link: "https://view.publitas.com/tdc/fit-tdc-catalogue-2018-japanese/",
    };

    const shifts = [
        {
            fullName: "Võ Thành Trung",
            role: "Trưởng Khoa CNTT",
            time: [
                {
                    timeOfDay: "Sáng",
                    dayOfWeek: "Thứ 2"
                },
                {
                    timeOfDay: "Chiều",
                    dayOfWeek: "Thứ 5"
                },
                {
                    timeOfDay: "Sáng",
                    dayOfWeek: "Thứ 6"
                }
            ]
        },
        {
            fullName: "Nguyễn Thị Thể",
            role: "Phó Khoa CNTT",
            time: [
                {
                    timeOfDay: "Sáng",
                    dayOfWeek: "Thứ 2"
                },
            ]
        }
    ]

    return (
        <div className='nav-side p-2'>
            <Filter />
            <AdDice images={diceImages} />
            <Catgelogue catelogue={catelogueE} />
            <Catgelogue catelogue={catelogueJP} />
            <ShiftTable shifts={shifts} />
        </div>
    )
}