import ReactDom from 'react-dom'

export default function NoteModal(props) {
    const { content, handleCloseModal } = props
    const { name, description } = content || {}
    return ReactDom.createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50'>
			<div onClick={handleCloseModal} className='absolute inset-0' />
            <div className='relative w-full max-w-[700px] p-6 bg-slate-800 dark:bg-white rounded-2xl shadow-xl border border-slate-700 dark:border-gray-200 text-center mx-auto overflow-y-auto max-h-[90vh] overflow-y-auto no-scrollbar'>
                <div className='p-4'>
                    <h2 className='text-2xl font-bold capitalize text-slate-100 dark:text-gray-900'>{name.replaceAll('-', ' ')}</h2>
                </div>
                <div>
                     {description}
                </div>
				<div className="flex justify-center gap-4 p-4">
				    <button
					  className="px-6 py-3 bg-slate-700 dark:bg-gray-200 text-white dark:text-gray-900 font-bold rounded-lg shadow-lg hover:bg-slate-600 dark:hover:bg-gray-300 transition-colors"
					  onClick={() => {
						localStorage.clear();
						window.location.reload();
					  }}
					>
					  Reset Grid
					</button>
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