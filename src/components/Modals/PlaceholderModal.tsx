import { Button, Modal, Section } from "@telegram-apps/telegram-ui";
import { useAppStore } from "../../store/useAppStore";

type PlaceholderModalProps = {
  title: string;
};

export const PlaceholderModal = ({ title }: PlaceholderModalProps) => {
  const closeModal = useAppStore((state) => state.closeModal);

  return (
    <Modal open onOpenChange={closeModal}>
      <Section header={title}>
        <div className="placeholder-content">
          <p>Функция в разработке</p>
          <Button onClick={closeModal}>Понятно</Button>
        </div>
      </Section>
    </Modal>
  );
};
