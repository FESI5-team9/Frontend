import Image from "next/image";
import Button from "@/components/Button/Button";
import Popup from "@/components/Popup";

interface PopupComponentProps {
  message: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
}
function PopupComponent({ message, id, isOpen, onClose }: PopupComponentProps) {
  return (
    <Popup id={id} isOpen={isOpen} onClose={onClose}>
      <div className="flex h-[156px] w-[252px] flex-col items-center justify-between tablet:h-[162px] tablet:w-[402px]">
        <Image
          src="/icons/X.svg"
          width={24}
          height={24}
          className="self-end"
          onClick={onClose}
          alt="닫기"
        />
        <p className="bold mt-2 text-center text-gray-700">{message}</p>
        <div className="w-[120px] tablet:self-end">
          <Button onClick={onClose} size="small" bgColor="yellow" className="w-full">
            확인
          </Button>
        </div>
      </div>
    </Popup>
  );
}

export default PopupComponent;
