import {AlignLeftOutlined, DownOutlined} from '@ant-design/icons';
import { Box, Circle, HStack, VStack } from '@chakra-ui/react';
import { Input,Select, Checkbox, Col, Row, Badge } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
// import type { SelectProps } from 'antd';

export default function Filter({filterOptions, filteredValues, setFilteredValues}){
    const [isOpen, setIsOpen] = useState(false);
    const [filterBottom, setFilterBottom] = useState(0); 
    const [filteredCnt, setFilteredCnt] = useState(0);
    const [t, i18n] = useTranslation();

    const itemOptions = filterOptions.item.map((option)=>{
        return({label: option, value: option})
    })
    const storeOptions = filterOptions.store.map((option)=>{
        return({label: option, value: option})
    })

    const itemOnChange = (checkedValues) => {
        var originValues = filteredValues;
        setFilteredValues({'store':originValues.store, 'item':checkedValues});
    };
    const storeOnChange = (checkedValues) => {
        var originValues = filteredValues;
        setFilteredValues({'store':checkedValues, 'item':originValues.item});
    };

    useEffect(()=>{
        setFilteredCnt(filteredValues.store.length + filteredValues.item.length);
    }, [filteredValues])
      
    useEffect(()=>{
        window.onresize = () => resetFilterCheckListTop();
        var filter = document.getElementById('filter');
        // var bottom = filter.getBoundingClientRect().height + (filter.getBoundingClientRect().y)/2;
        var bottom = filter.offsetHeight + 12-3;
        resetFilterCheckListTop();
        function resetFilterCheckListTop(){
            setFilterBottom(bottom);
        }
    }, [])

    const handleClick = () =>{
        setIsOpen(!isOpen);
    }

    return(
        <VStack 
            spacing={5}
            align='stretch'>
            <Box w='45vw' rounded='md' p="2" boxShadow='base' id="filter"
                style={{'outlineStyle':'solid', 'outlineColor':'#d9d9d9'}}>
                <HStack justifyContent={'space-between'} onClick={handleClick} >
                    <Badge count={filteredCnt? filteredCnt:0} offset={[4, 0]} color={'#13c2c2'}>
                        <AlignLeftOutlined/>
                    </Badge>
                    {/* <Badge count={filteredCnt? filteredCnt:0} offset={[notificationPos, 0]} color={'#13c2c2'}> */}
                        <p style={{'left':0}}>{t('categoryFilter')}</p>
                    {/* </Badge> */}
                    <DownOutlined style={{right: 0}}/>
                </HStack>
            </Box>
            {isOpen? 
                <Box backgroundColor={'white'} width="45vw" minH="10rem" top={`${filterBottom}`} p={5}
                    position={'absolute'} style={{'outlineStyle':'solid', 'outlineColor':'#d9d9d9'}}>
                    <VStack spacing={2} align="baseline">
                        {itemOptions?
                            <>
                                <p style={{fontWeight:"bold"}}>品項分類：</p>
                                <Checkbox.Group style={{width:"100%"}} 
                                    defaultValue={filteredValues.item} onChange={itemOnChange}>
                                        <Row style={{width:"100%"}} >
                                            {filterOptions.item.map((option)=>{
                                                return(
                                                <Col span={6} key={option}>
                                                    <Checkbox value={option}>{option}</Checkbox>
                                                </Col>)
                                            })}
                                        </Row>
                                </Checkbox.Group>
                                <p/>
                            </>:<></>
                        }
                        {storeOptions.length > 1?
                            <>
                                <p style={{fontWeight:"bold"}}>店家分類：</p>
                                <Checkbox.Group options={storeOptions} 
                                    defaultValue={filteredValues.store} onChange={storeOnChange} />
                                <p/>
                            </>:<></>
                        }
                    </VStack>
                </Box>
                :<></>
            }
        </VStack>
    )
};
