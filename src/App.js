import React, { useState } from 'react';
import { View, Panel, PanelHeader, Button, HorizontalScroll, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import CatFactsApp from './CatFactsApp';
import AgeName from './ageName';

const App = () => {
  const [activePanel, setActivePanel] = useState('main');

  const handlePanelChange = (newPanel) => {
    setActivePanel(newPanel);
  };

  return (
    <View activePanel={activePanel}>
        <Panel id="main">
          <PanelHeader>Task VK trainee</PanelHeader>
          <HorizontalScroll>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <SplitCol>
                <Button stretched size="l" onClick={() => handlePanelChange('catFactPanel')}>
                  Узнай факты о котах
                </Button>
              </SplitCol>
              <SplitCol>
                <Button stretched size="l" onClick={() => handlePanelChange('agePanel')}>
                  Узнай возраст по имени
                </Button>
              </SplitCol>
            </div>
          </HorizontalScroll>
        </Panel>

      <Panel id="agePanel">
        <AgeName onPanelChange={handlePanelChange} />
      </Panel>

      <Panel id="catFactPanel">
        <CatFactsApp onPanelChange={handlePanelChange} />
      </Panel>
    </View>
  );
};

export default App;