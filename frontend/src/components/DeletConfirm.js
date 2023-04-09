import React, { useRef } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useToast
} from '@chakra-ui/react'
import instance from '../api';
import {useStoreAdmin} from "../hooks/useStoreAdmin";


export default ({ isOpen, onOpen, onClose, item }) => {
  //const { isOpen, onOpen, onClose } = useDisclosure()
  const {store, stocks, setStocks, getItems} = useStoreAdmin();
  const toast = useToast()
  const cancelRef = React.useRef()
  const HandleDelete = async() => {
    const {data, status}
    = await instance.delete('api/1.0/admin/food', { 
        params: {
            storeID: store,
            foodID: item.food._id
        }
    })
    if (status === 200) {
        await getItems();
        toast({
            title: `已成功刪除 ${item.food.name}`,
            status: 'success',
            isClosable: true,
        })
    }
    onClose();
  }

  return (
    

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              確定刪除 {item.food.name} ?
            </AlertDialogHeader>

            {/*<AlertDialogBody>
        
            </AlertDialogBody>*/}

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                否
              </Button>
              <Button colorScheme='red' onClick={HandleDelete} ml={3}>
                是
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    
  )
}