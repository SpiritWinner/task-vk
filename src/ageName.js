import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { View, Panel, PanelHeader, Group, FormLayoutGroup, Input, Button, Header } from '@vkontakte/vkui';

const AgeName = ({ onPanelChange }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestedName, setLastRequestedName] = useState('');
  const cancelTokenRef = useRef(null);

  const fetchAge = async (name) => {
    try {
      setIsLoading(true);
      setLastRequestedName(name);

      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Запрос отменен');
      }

      const cancelToken = axios.CancelToken.source();
      cancelTokenRef.current = cancelToken;

      const response = await axios.get(`https://api.agify.io/?name=${name}`, {
        cancelToken: cancelToken.token,
      });

      if (name === lastRequestedName) {
        setAge(response.data.age);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Запрос отменен:', error.message);
      } else {
        console.error('Ошибка при выполнении запроса:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    fetchAge(data.name);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (lastRequestedName !== '') {
        fetchAge(lastRequestedName);
      }
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [lastRequestedName]);

  return (
    <View activePanel="agePanel">
      <Panel id="agePanel">
       <PanelHeader>Определение возраста по имени</PanelHeader>
        <Group>
          <FormLayoutGroup onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('name', {
                required: true,
                pattern: {
                  value: /^[a-zA-Zа-яА-Я]+$/,
                  message: 'Имя должно состоять только из букв'
                },
                onChange: (e) => {
                  setValue('name', e.target.value);
                  setLastRequestedName(e.target.value);
                  setAge('');
                },
              })}
              type="text"
              placeholder="Введите имя"
              status={errors.name ? 'error' : 'default'}
            />
            <Button type="submit" size="l" stretched disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Отправить'}
            </Button>
          </FormLayoutGroup>
          {age && <p>Возраст: {age}</p>}
        </Group>
        <Button onClick={() => onPanelChange('main')}>Перейти на главную</Button>
      </Panel>
    </View>
  );
};

export default AgeName;