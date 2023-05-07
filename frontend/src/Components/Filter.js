import {ControlOutlined, AlignLeftOutlined, DownOutlined} from '@ant-design/icons';
import { Box, HStack, StackDivider, VStack } from '@chakra-ui/react';
import { Input,Select, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
// import type { SelectProps } from 'antd';

// const options: SelectProps['options'] = [];

export default function Filter(){
    const [isOpen, setIsOpen] = useState(false);
    const [filterBottom, setFilterBottom] = useState(0); 

    // var options = [];
    // for (let i = 10; i < 36; i++) {
    //     options.push({
    //       value: i.toString(36) + i,
    //       label: i.toString(36) + i,
    //     });
    // }
    const options = [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' },
    ];

    // const onChange = (checkedValues) => {
    //     console.log('checked = ', checkedValues);
    // };
      
    useEffect(()=>{
        window.onresize = () => resetFilterCheckListTop();
        var filter = document.getElementById('filter');
        var bottom = filter.getBoundingClientRect().bottom;
        
        resetFilterCheckListTop();
        function resetFilterCheckListTop(){
            setFilterBottom(bottom);
        }
    }, [])

      
    // const handleChange = (value) => {
    //     console.log(`selected ${value}`);
    // };
    const handleClick = () =>{
        setIsOpen(!isOpen);
    }
    

    return(
        <VStack 
            spacing={5}
            align='stretch'>
            {/* <Box >
                <Select
                    style={{ width: '45vw'}}
                    addonBefore={<AlignLeftOutlined />}
                    addonAfter={<DownOutlined onClick={handleClick}/>}
                    defaultValue="篩選食物類別"
                    onClick={handleClick}
                    options={
                    <Checkbox.Group options={options} defaultValue={['Apple']} onChange={onChange} />}
                />
            </Box> */}
            <Box w='45vw' rounded='md' p="2" boxShadow='base' id="filter"
                style={{'outlineStyle':'solid', 'outlineColor':'#d9d9d9'}}>
                <HStack justifyContent={'space-between'} onClick={handleClick} >
                    <AlignLeftOutlined/>
                    <p style={{'left':0}}>篩選食物類別</p>
                    <DownOutlined style={{right: 0}}/>
                </HStack>
            </Box>
            {isOpen? 
                <Box backgroundColor={'white'} width="45vw" minH="10rem" top={`${filterBottom}`}
                position={'absolute'} style={{'outlineStyle':'solid', 'outlineColor':'#d9d9d9'}}>
                    
                </Box>
                :<></>
            }
            
        
        {/* <Select
            mode="tags"
            style={{ width: '45vw' }}
            placeholder="篩選食物類別"
            onChange={handleChange}
            options={options}>
                
        </Select> */}
        </VStack>
        
    )

    
};
