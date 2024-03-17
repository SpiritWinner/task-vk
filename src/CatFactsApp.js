import React, {useState, useEffect, useRef} from 'react';
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form';
import { View, Panel, PanelHeader, Group, Input, Button, FormLayoutGroup, Header} from '@vkontakte/vkui';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

async function fetchCatFact() {
    const {data} = await axios.get('https://catfact.ninja/fact');
   
    return data.fact ;
}

const validationSchema = yup.object().shape({
  catFact: yup.string(),
});

const CatFactsApp = ({ onPanelChange }) => {

  const [fact, setFact] = useState('');
  const inputRef = useRef(null);

  const {data, isLoading, refetch} = useQuery({
    queryKey:['catFact'],
    queryFn: fetchCatFact,
    enabled: false,
  });

  const {
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      const firstSpace = data.indexOf(' ');
      setFact(data);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(firstSpace, firstSpace);
          inputRef.current.focus();
        }
      }, 0);
    }
  }, [data, setValue]);

  return (
    <View activePanel="catFactPanel">
       <Panel id="catFactPanel">
       <PanelHeader>Факт о котах</PanelHeader>
        <Group>
          <FormLayoutGroup>
              <Input
                getRef={inputRef}
                type="text"
                value={fact || "Нажми на кнопку"}
                status={errors.catFact ? 'error' : 'default'}
                bottom={errors.catFact?.message}
              />
          </FormLayoutGroup>
          <Button
            size="l"
            stretched
            onClick={refetch}
            disabled={isLoading}
            data-test-id="get-cat-fact-button"
          >
            {isLoading ? 'Loading...' : 'Get Cat Fact'}
          </Button>
        </Group>
        <Button onClick={() => onPanelChange('main')}>Перейти на главную</Button>
      </Panel>
    </View>
    )
};

export default CatFactsApp;
