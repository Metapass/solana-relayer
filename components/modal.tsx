import React from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";

export default function ModalComponent({
  handler,
  visible,
  setVisible,
  closeHandler,
  explorerLink,
}: any) {
  return (
    <div>
      {/* <Button auto shadow onClick={handler}>
        Open modal
      </Button> */}
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text b size={18}>
              Transaction Succesfull 🎉
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable={false}
            bordered
            fullWidth
            size="lg"
            disabled
            value={explorerLink}
            // contentLeft={<Mail fill="currentColor" />}
          />
          {/* <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Password"
            // contentLeft={<Password fill="currentColor" />}
          />
          <Row justify="space-between">
            <Checkbox>
              <Text size={14}>Remember me</Text>
            </Checkbox>
            <Text size={14}>Forgot password?</Text>
          </Row> */}
        </Modal.Body>
        <Modal.Footer justify="center">
          {/* <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button> */}
          <Button
            auto
            onClick={() => {
              window.open(explorerLink, "_blank");
            }}
          >
            Go to explorer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
