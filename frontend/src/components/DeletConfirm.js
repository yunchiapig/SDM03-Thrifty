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
import { useTranslation } from 'react-i18next';


export default ({ isOpen, onOpen, onClose, item }) => {
  //const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation();
  const {store, stocks, setStocks, jwt, storeInfo, getItems} = useStoreAdmin();
  const toast = useToast()
  const cancelRef = React.useRef()
  const params = {
    storeID: storeInfo._id,
    foodID: item._id
  }
  const HandleDelete = async() => {
    const {data, status}
    = await instance.delete('api/1.0/admin/food', {  
      headers: {
        'Authorization': `Bearer ${jwt}`,
      }, params })
    if (status === 200) {
        await getItems();
        const name = item.foodInfo.name
        toast({
            title: t("toast.delete", {name}),
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
              {t("deleteconfirm")} {item.foodInfo.name} ?
            </AlertDialogHeader>

            {/*<AlertDialogBody>
        
            </AlertDialogBody>*/}

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("no")}
              </Button>
              <Button colorScheme='red' onClick={HandleDelete} ml={3}>
                {t("yes")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    
  )
}