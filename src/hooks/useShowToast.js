import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title, desciption, status) => {
      toast({
        title: title, // String any
        description: desciption, // Notification content
        status: status, // success || error || warning || info
        duration: 3000, // in ms
        isClosable: true, // Able to close or not
      });
    },
    [toast]
  );
  return showToast;
};

export default useShowToast;

// Documentation Link: https://v2.chakra-ui.com/docs/components/toast/usage
