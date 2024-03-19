import dayjs from 'dayjs'

const CloserSheetColumns: any = (businessList: any) => {
  return [
    {
      header: 'Date',
      accessorFn: (originalRow: any) => dayjs(originalRow.createdAt),
      filterVariant: 'date-range',
      Cell: ({ cell }: any) => {
        const value = cell.getValue()

        return dayjs(value).format('l')
      },
      accessorKey: 'createdAt'

      // Cell: ({ cell }: any) => cell.getValue().toLocaleDateString()
    },
    {
      header: 'Business Name',
      accessorKey: 'business_id.business_name',
      filterVariant: 'autocomplete',
      filterSelectOptions: businessList
    },

    {
      header: 'Closer',
      accessorKey: 'closer_id.user_name'
    },
    {
      header: 'Work Type',
      accessorKey: 'ticket_id.work_status'
    },
    {
      header: 'Payment',
      accessorKey: 'received_payment',
      Cell: ({ cell }: any) => {
        const value = cell.getValue()

        return `$${value}`
      }
    }
  ]
}

export default CloserSheetColumns