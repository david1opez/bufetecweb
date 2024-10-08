import image1 from '../../assets/1.png';
import image2 from '../../assets/2.png';
import image3 from '../../assets/3.png';
import image4 from '../../assets/4.png';
import image5 from '../../assets/5.png';
import image6 from '../../assets/6.png';
import image7 from '../../assets/7.png';
import image8 from '../../assets/8.png';
import image9 from '../../assets/9.png';
import image10 from '../../assets/10.png';

const page = () => {
  return (
    <div>
        <img src={image1.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image2.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image3.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image4.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image5.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image6.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image7.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image8.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image9.src} className="w-full h-50 object-cover mb-2"/>
        <img src={image10.src} className="w-full h-50 object-cover mb-2"/>
    </div>
  )
}

export default page
