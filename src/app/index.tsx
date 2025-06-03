import Clientes from "@/app/pages/PaginaClientes";
import Roupas from "@/app/pages/Roupas";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { TabBar, TabBarProps, TabView } from 'react-native-tab-view';

export default function Index() {
  const router = useRouter();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  
  type Route = {
    key: string;
    title: string;
  };

  const routes = [
    { key: 'cliente', title: 'Clientes' },
    { key: 'roupas', title: 'Roupas' },
  ];

  const renderTabBar = (props: TabBarProps<Route>) => (
    <TabBar 
      {...props}
      style={{backgroundColor: '#7B3FA0'}}
      activeColor="white"
      pressColor="white"
    />
  );
  
  return ( 
    <TabView
      navigationState={{ index, routes }}
      renderScene={({route}) => {
        switch(route.key) {
          case 'cliente':
            return <Clientes />;
          case 'roupas':
            return <Roupas />;
          default:
            return null;
        }
      }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      swipeEnabled = {false}
      renderTabBar={renderTabBar}
    />
    
  );
}
