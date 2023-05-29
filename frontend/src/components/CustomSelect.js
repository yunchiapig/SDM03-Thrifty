
import {useStoreAdmin} from "../hooks/useStoreAdmin";
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import {
    Box,
    Text,
    useDisclosure,
    Stack,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    VStack,
    StackDivider,
    Card
    //Select
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next';

export default ({tag, setTag }) => {
    const { t } = useTranslation();
    const {stocks} = useStoreAdmin();
    const [focus, setFocus] = useState(false);
    const cardRef = useRef(null);
    const handleSelect = (t) => {
        setTag(t);
        setFocus(false);
    }
    const handleInput = (e) => {
        setTag(e.target.value);
        
    }

    useEffect(() => {
        function handleClickOutside(event) {
          if (cardRef.current && !cardRef.current.contains(event.target)) {
            setFocus(false);
          }
        }
        const handleEnter = (e) => {
            if (e.key === 'Enter' && cardRef.current) { 
                setFocus(false); 
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keypress", handleEnter);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          document.removeEventListener("keypress", handleEnter);
        };
      }, [cardRef]);
    return (
        <Box>
            <InputGroup>
                <Input onClick={() => {setFocus(true)}} value={tag} onChange={e => handleInput(e)}  errorBorderColor='crimson'/>
                <InputRightElement children={<ChevronDownIcon color='grey' />} />
                </InputGroup>
            { focus && stocks?.length > 0?
            <Card ref={cardRef} position='absolute' zIndex={1} w='85%' my={1} maxH={300} overflow='scroll'>
                <VStack
                    divider={<StackDivider borderColor='gray.200' />}
                    align='stretch'
                    py={2}
                >
                    {stocks.map(s => {
                        return (
                            <Box key = {s.category} as="span" flex='1' textAlign='left' display= 'flex' alignItems='center' h = {10} pl = {3} bg={s.category === tag ? '#EDF2F6': 'white'} onClick={() => handleSelect(s.category)} cursor='pointer'>
                                {s.category}
                            </Box>
                        )
                    })}
                </VStack>
            </Card> :
            null }
        </Box>
    )
}