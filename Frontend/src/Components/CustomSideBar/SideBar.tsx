import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery } from '@mui/material';
import './SideBar.scss';
import logo from '../../asserts/images/cropped-purple-logo.png';
import GridViewIcon from '@mui/icons-material/GridView';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { TokenContext } from '../Context/TokenContext';
type UserRole = 'admin' | 'user' | 'organization';
type SideBarOption = {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
};

export const SideBarOptions: SideBarOption[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: GridViewIcon,
    roles: ['organization', 'user', 'admin'],
  },
  {
    id: 'postJob',
    label: 'Jobs',
    icon: WorkOutlineIcon,
    roles: ['organization', 'user','admin'],
  },
  {
    id: 'companies',
    label: 'Companies',
    icon: ApartmentIcon,
    roles: ['admin'],
  },
  {
    id: 'applications',
    label: 'Applications',
    icon: FolderOpenIcon,
    roles: ['organization', 'user'],
  },
  {
    id: 'users',
    label: 'Users',
    icon: PersonOutlineIcon,
    roles: ['admin'],
  },
];

const SideBar = () => {
  const {userType} : any = useContext(TokenContext);
  const navigate = useNavigate();
  const filterOptions = SideBarOptions.filter((option) => option.roles.includes(userType));
  const [value, setValue] = React.useState(0);
  const isSmallScreen = useMediaQuery('(max-width:1024px)');
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    handleNavigation(filterOptions[newValue].id);
  };
  

  const handleNavigation = (id: string) => {
    switch (id) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'postJob':
        navigate('/dashboard/job-posts');
        break;
      case 'companies':
        navigate('/dashboard/companies');
        break;
      case 'applications':
        navigate('/dashboard/applications');
        break;
      case 'users':
        navigate('/dashboard/users');
        break;
      default:
        navigate('/dashboard');
    }
  };

  

  return (
    <>
    <div className="fullPage">
      <div className="sideBar">
        <div className="logoContainer">
          <img src={logo} alt="logo" width="170px" height="110px" />
        </div>
        <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
          <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="side bar"
            sx={{display:'flex',justifyContent:'center'}}
          >
            {filterOptions.map((option, index) => (
              <Tab
                icon={<option.icon/>}
                iconPosition="start"
                key={option.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'left',
                  textAlign: 'left',
                  width: '100%',
                  paddingLeft:'75px',
                  position: isSmallScreen ? 'relative' : 'static',
                  right: isSmallScreen ? '25px' : '0px',
                  textTransform:'none',
                  '&::first-letter':{
                    textTransform:'uppercase'
                  },
                  letterSpacing:'1px',

                }}
                label={
                  <div className='tabLabel'>
                    <span>{option.label}</span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </Box>
      </div>
      
    </div>
    </>
  );
};

export default SideBar;
