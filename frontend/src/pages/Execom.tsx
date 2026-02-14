import { useRef } from 'react';
import MemberCard from '../components/MemberCard/MemberCard';
import type { Member } from '../types/member';
import styles from './Execom.module.css';

// Import all Execom images
import img1 from '../assets/Execom/AFLAH MUHAMMED .jpg';
import img2 from '../assets/Execom/Abhinand T V marketing_.jpg';
import img3 from '../assets/Execom/Aithel_Christo_CP_Sub_Lead.JPG';
import img4 from '../assets/Execom/Alen_Joe_Benny.jpg';
import img5 from '../assets/Execom/Alwin Pramod_CS Sub Lead.jpg';
import img6 from '../assets/Execom/AnnSusanJose_design sub lead.jpg';
import img7 from '../assets/Execom/DevikaSajeesh_Web.jpg';
import img8 from '../assets/Execom/Fuad Fysal_Media.jpg';
import img9 from '../assets/Execom/Gautham Krishna B_President.jpg';
import img10 from '../assets/Execom/Gautham Thrilok CP Sub Lead.jpg';
import img11 from '../assets/Execom/George S_Media.jpg';
import img12 from '../assets/Execom/Gowri Lal_WIT.jpeg';
import img13 from '../assets/Execom/Harikrishnan_Web.jpg';
import img14 from '../assets/Execom/Ivin Mathew Kurian_Mentor.JPG';
import img15 from '../assets/Execom/Jestine Thomas Mathew_CS SUB LEAD.jpg';
import img16 from '../assets/Execom/Jordy George Justin CP Lead.jpg';
import img17 from '../assets/Execom/KIRAN_ CYBER SECURITY LEAD.jpg';
import img18 from '../assets/Execom/Ken Mani Joint Secretary.jpg';
import img19 from '../assets/Execom/Navaneeta Design Sub-lead.jpg';
import img20 from '../assets/Execom/Naveed Niaz CP Sub Lead.jpg';
import img21 from '../assets/Execom/Sooraj V_Content.jpeg';

// Helper to parse name and role from filename (e.g., "Name_Role" or "Name Role")
// This is a manual mapping for better control since formatting varies
const RAW_MEMBERS = [
  { img: img9, name: 'Gautham Krishna B', role: 'Chairperson' },
  { img: img4, name: 'Alen Joe Benny', role: 'Vice Chairperson' },
  { img: img1, name: 'Aflah Muhammed', role: 'Secretary' },
  { img: img18, name: 'Ken Mani', role: 'Joint Secretary' },
  { img: img17, name: 'Kiran', role: 'Cyber Security Lead' },
  { img: img16, name: 'Jordy George Justin', role: 'Competitive Programming Lead' },
  { img: img15, name: 'Jestine Thomas Mathew', role: 'Cyber Security Sub Lead' },
  { img: img5, name: 'Alwin Pramod', role: 'Cyber Security Sub Lead' },
  { img: img10, name: 'Gautham Thrilok', role: 'Competitive Programming Sub Lead' },
  { img: img20, name: 'Naveed Niaz', role: 'Competitive Programming Sub Lead' },
  { img: img7, name: 'Devika Sajeesh', role: 'Web Lead'},
  { img: img13, name: 'Harikrishnan', role: 'Web Lead'},
  { img: img12, name: 'Gowri Lal', role: 'WIT Lead' },
  { img: img3, name: 'Aithel Christo', role: 'CPSub Lead' },
  { img: img14, name: 'Ivin Mathew Kurian', role: 'Mentor' },
  
  { img: img2, name: 'Abhinand T V', role: 'Marketing' },
  { img: img8, name: 'Fuad Fysal', role: 'Media Team' },
  { img: img6, name: 'Ann Susan Jose', role: 'Design Sub Lead' },
  { img: img19, name: 'Navaneeta', role: 'Design Sub Lead' },
  { img: img11, name: 'George S', role: 'Content Team Lead'},
  { img: img21, name: 'Sooraj V', role: 'Content Team Lead'}
];

const EXECOM_MEMBERS: Member[] = RAW_MEMBERS.map((m, i) => ({
  id: String(i + 1),
  name: m.name,
  role: m.role,
  imageUrl: m.img,
  socials: {}, // Socials can be filled later
}));

export default function Execom() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.tag}>
            <div className={styles.tagDot} />
            <span className={styles.tagText}>Executive Committee 2026</span>
          </div>
          
          <h1 className={styles.title}>
            Meet the New <span className={styles.highlight}>Execom</span>
          </h1>
        </header>

        <div className={styles.memberGrid}>
          {EXECOM_MEMBERS.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}