import ReactDom from 'react-dom'

export default function Modal(props) {
    const { content, handleCloseModal } = props
    const { name, description, images = [] } = content || {}
    return ReactDom.createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50'>
			<div onClick={handleCloseModal} className='absolute inset-0' />
            <div className='relative w-full max-w-lg p-6 bg-slate-800 dark:bg-white rounded-2xl shadow-xl border border-slate-700 dark:border-gray-200 text-center mx-auto overflow-y-auto max-h-[90vh] overflow-y-auto no-scrollbar'>
                <div>
                    <h2 className='text-2xl font-bold mb-4 capitalize text-slate-100 dark:text-gray-900'>{name.replaceAll('-', ' ')}</h2>
                </div>
                <div>
                    <p className='text-base text-slate-300 dark:text-gray-700 whitespace-pre-wrap'>{description}</p>
                </div>
				<div className="flex flex-wrap justify-center gap-4 mt-4">
					{images.length > 0 && (
						<div className="modal-images">
							{images.map((img, idx) => (
								<img key={idx} src={img} alt={`${name} ${idx + 1}`} className="w-full h-auto rounded-lg shadow-md" />
							))}
						</div>
					)}
				</div>
				<div className="flex justify-center gap-4 my-8 p-4">
					<button
					  className="px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
					  onClick={handleCloseModal}
					>
					  Close
					</button>
				</div>
            </div>
        </div>,
        document.getElementById('portal')
    )
}