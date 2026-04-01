import React from 'react'; 
import { 
  Home, Info, Landmark, Briefcase, GraduationCap, Sprout, 
  Map, Stethoscope, Trophy, HandCoins, MessageCircleWarning 
} from 'lucide-react';
import './SideBar.css';

// NOTICE: We are receiving { activeTab, setActiveTab } from the App
const SideBar = ({ activeTab, setActiveTab }) => {

  const menuItems = [
    { name: 'Home',           icon: Home,                 color: '#1a73e8' },
    { name: 'Detail',         icon: Info,                 color: '#5f6368' },
    { name: 'Administration', icon: Landmark,             color: '#d93025' },
    { name: 'Service',        icon: Briefcase,            color: '#e37400' },
    { name: 'Education',      icon: GraduationCap,        color: '#1a73e8' },
    { name: 'Agriculture',    icon: Sprout,               color: '#188038' },
    { name: 'Tourism',        icon: Map,                  color: '#a142f4' },
    { name: 'HealthCare',     icon: Stethoscope,          color: '#d93025' }, /* Fixed spelling to match App.jsx */
    { name: 'Sports',          icon: Trophy,               color: '#f9ab00' },
    { name: 'Schemes',        icon: HandCoins,            color: '#1967d2' },
    { name: 'Grievances',     icon: MessageCircleWarning, color: '#c5221f' },
  ];

  return (
    <aside className="sidebar">
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        
        // Check if this item is the Active one passed from App
        const isActive = activeTab === item.name;

        return (
          <div 
            key={item.name}
            className={`nav-item ${isActive ? 'active' : ''}`}
            // WHEN CLICKED: Tell App to change the tab
            onClick={() => setActiveTab(item.name)}
          >
            <IconComponent 
              size={24} 
              color={isActive ? '#1967d2' : item.color} 
              className="nav-icon"
            />
            <span className="nav-text">{item.name}</span>
          </div>
        );
      })}
    </aside>
  );
};

export default SideBar;