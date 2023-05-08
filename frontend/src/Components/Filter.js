import {AlignLeftOutlined, DownOutlined} from '@ant-design/icons';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { Input,Select, Checkbox, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
// import type { SelectProps } from 'antd';

export default function Filter({filterOptions, filteredValues, setFilteredValues}){
    const [isOpen, setIsOpen] = useState(false);
    const [filterBottom, setFilterBottom] = useState(0); 

    const itemOptions = filterOptions.item.map((option)=>{
        return({label: option, value: option})
    })
    const storeOptions = filterOptions.store.map((option)=>{
        return({label: option, value: option})
    })
    // [
    //     { label: 'Apple', value: 'Apple' },
    //     { label: 'Pear', value: 'Pear' },
    //     { label: 'Orange', value: 'Orange' },
    // ];

    const itemOnChange = (checkedValues) => {
        var originValues = filteredValues;
        setFilteredValues({'store':originValues.store, 'item':checkedValues});
    };
    const storeOnChange = (checkedValues) => {
        var originValues = filteredValues;
        setFilteredValues({'store':checkedValues, 'item':originValues.item});
    };
      
    useEffect(()=>{
        window.onresize = () => resetFilterCheckListTop();
        var filter = document.getElementById('filter');
        var bottom = filter.getBoundingClientRect().bottom;

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
                    <AlignLeftOutlined/>
                    <p style={{'left':0}}>篩選食物類別</p>
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
                                        <Row >
                                            {filterOptions.item.map((option)=>{
                                                console.log(option);
                                                return(
                                                <Col span={6}>
                                                    <Checkbox value={option}>{option}</Checkbox>
                                                </Col>)
                                            })}
                                        </Row>
                                </Checkbox.Group>
                                <p/>
                            </>:<></>
                        }
                        {storeOptions?
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
