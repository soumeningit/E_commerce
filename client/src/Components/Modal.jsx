import { MdErrorOutline } from "react-icons/md";

function Modal({ btn1, btn2, heading, text, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity"></div>
      <div className="relative z-20 w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8">
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <MdErrorOutline
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold text-gray-900">
                {heading}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto cursor-pointer"
          >
            {btn1}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
          >
            {btn2}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
