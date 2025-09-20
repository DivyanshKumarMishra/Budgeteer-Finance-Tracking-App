'use client';

import { bulkDeleteTransactions } from '@/actions/accounts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { categoryColors } from '@/data/categories';
import useFetch from '@/hooks/UseFetch';
import { format } from 'date-fns/format';
import {
  ChevronDown,
  ChevronUp,
  ClockIcon,
  MoreHorizontalIcon,
  RefreshCw,
  Search,
  TrashIcon,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

const RECURRING_INTERVALS = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};

function TransactionTable({ transactions = [], accountId }) {
  const router = useRouter();
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: 'date',
    direction: 'desc',
  });

  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [recurringFilter, setRecurringFilter] = useState('');
  const searchTimer = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [activePage, setActivePage] = useState(1);
  const transactionsPerPage = 10;

  const {
    data: bulkDelete,
    loading: bulkDeleteLoading,
    fn: bulkDeleteFn,
  } = useFetch(bulkDeleteTransactions);

  useEffect(() => {
    searchTimer.current = setTimeout(() => {
      setSearchText(inputValue);
      setActivePage(1);
    }, 300);

    return () => clearTimeout(searchTimer.current);
  }, [inputValue]);

  const filterTransactions = () => {
    return transactions
      .filter((txn) =>
        searchText
          ? txn.description.toLowerCase().includes(searchText.toLowerCase())
          : true
      )
      .filter((txn) => (typeFilter ? txn.type.toString() === typeFilter : true))
      .filter((txn) =>
        recurringFilter
          ? recurringFilter === 'recurring'
            ? txn.isRecurring === true
            : txn.isRecurring === false
          : true
      );
  };

  const sortTransactions = (txns) => {
    let sorted = [...txns];

    if (sortConfig.field === 'date') {
      sorted = sorted.sort((a, b) =>
        sortConfig.direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
    } else if (sortConfig.field === 'category') {
      sorted.sort((a, b) =>
        sortConfig.direction === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category)
      );
    } else {
      sorted.sort((a, b) =>
        sortConfig.direction === 'asc'
          ? a[sortConfig.field] - b[sortConfig.field]
          : b[sortConfig.field] - a[sortConfig.field]
      );
    }

    return sorted;
  };

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = filterTransactions();
    const sorted = sortTransactions(filtered);
    setActivePage(1);
    return sorted;
  }, [transactions, searchText, typeFilter, recurringFilter, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelect = (id) => {
    if (!id) return;
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedTransactions((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((transaction) => transaction.id)
    );
  };

  const clearFilters = () => {
    setSearchText('');
    setInputValue('');
    setTypeFilter('');
    setRecurringFilter('');
    setSelectedTransactions([]);
    setFilteredAndSortedTransactions(transactions);
    setActivePage(1);
  };

  const handleBulkDelete = () => {
    if (!window.confirm('Are you sure you want to delete these transactions?'))
      return;

    bulkDeleteFn(selectedTransactions, accountId);
  };

  useEffect(() => {
    if (bulkDelete?.success) {
      toast.success('Transactions deleted successfully');
    }
  }, [bulkDelete, bulkDeleteLoading]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / 10);
  const startIndex = (activePage - 1) * transactionsPerPage;
  const endIndex = activePage * transactionsPerPage;
  const transactionsToDisplay = filteredAndSortedTransactions.slice(
    startIndex,
    endIndex
  );

  // bulkDeleteLoading = true;

  return (
    <div className="space-y-4">
      {/* <h2 className="text-2xl lg:text-3xl text-center font-semibold text-muted-foreground">Transactions</h2> */}

      {bulkDeleteLoading && (
        <BarLoader color="#059669" width={'100%'} className="mb-4" />
      )}

      {/* filters */}
      <div className="flex flex-col items-center justify-between md:flex-row gap-4 px-4 w-full">
        <div className="relative w-full md:flex-1 md:max-w-xl">
          <Search className="absolute top-2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search transaction..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-9 border-gray-700"
            disabled={bulkDeleteLoading}
          />
        </div>
        <div className="flex gap-2 w-full md:flex-1 md:w-auto">
          <Select
            onValueChange={(value) => setTypeFilter(value)}
            value={typeFilter}
            disabled={bulkDeleteLoading}
          >
            <SelectTrigger className="border-gray-700 flex-1 min-w-0">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setRecurringFilter(value)}
            value={recurringFilter}
            disabled={bulkDeleteLoading}
          >
            <SelectTrigger className="border-gray-700 flex-1 min-w-0">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="non-recurring">Non-recurring</SelectItem>
            </SelectContent>
          </Select>
          {(searchText || typeFilter || recurringFilter) && (
            <Button
              variant="destructive"
              onClick={clearFilters}
              disabled={bulkDeleteLoading}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          )}
        </div>

        <div>
          {selectedTransactions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleteLoading}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Deleted seleted ({selectedTransactions.length})
              {selectedTransactions.length > 1 && 's'}
            </Button>
          )}
        </div>
      </div>

      {/* table */}
      <div className="px-4">
        <Table>
          {/* <TableCaption className="text-lg">Transactions</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  disabled={bulkDeleteLoading}
                  checked={
                    selectedTransactions.length ===
                      filteredAndSortedTransactions.length &&
                    filteredAndSortedTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="w-[100px] cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center justify-center gap-2">
                  Date
                  {sortConfig.field === 'date' &&
                    (sortConfig.direction === 'asc' ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronUp className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="w-[100px] cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center justify-start gap-2">
                  Category
                  {sortConfig.field === 'category' &&
                    (sortConfig.direction === 'asc' ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronUp className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Amount
                  {sortConfig.field === 'amount' &&
                    (sortConfig.direction === 'asc' ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronUp className="h-3 w-3" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">Recurring</TableHead>
              <TableHead className="text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
            {transactionsToDisplay?.length > 0 &&
              transactionsToDisplay?.map((txn) => {
                const {
                  date,
                  description,
                  category,
                  amount,
                  type,
                  isRecurring,
                  recurringInterval,
                  nextRecurringDate,
                } = txn;
                return (
                  <TableRow key={txn.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTransactions.includes(txn.id)}
                        disabled={bulkDeleteLoading}
                        onCheckedChange={() => handleSelect(txn.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {format(new Date(date), 'PP')}
                    </TableCell>
                    <TableCell>{description}</TableCell>
                    <TableCell className="capitalize">
                      <span
                        className="px-2 py-1 rounded-sm text-sm text-white"
                        style={{
                          backgroundColor: categoryColors[category],
                        }}
                      >
                        {category}
                      </span>
                    </TableCell>
                    <TableCell
                      className="text-right font-medium"
                      style={{ color: type === 'EXPENSE' ? 'red' : 'green' }}
                    >
                      {type === 'EXPENSE' ? '-' : '+'}₹
                      {parseFloat(amount)?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isRecurring ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1 bg-purple-200 text-purple-700"
                            >
                              <RefreshCw className="w-4 h-4" />
                              {RECURRING_INTERVALS[recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <p className="font-medium">
                                {' '}
                                Next Recurring Date
                              </p>
                              <p>{format(new Date(nextRecurringDate), 'PP')}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <ClockIcon className="w-4 h-4" />
                          One Time
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-8 h-8 p-0"
                            disabled={bulkDeleteLoading}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontalIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(`transactions/create?edit${txn.id}`);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => bulkDeleteFn([txn.id], accountId)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="md"
          className="p-2"
          disabled={activePage === 1 || bulkDeleteLoading}
          onClick={() => setActivePage(activePage - 1)}
        >
          Prev
        </Button>
        <RenderPageNumbers
          totalPages={totalPages}
          currentPage={activePage}
          onPageClick={setActivePage}
          shouldDisable={bulkDeleteLoading}
        />
        <Button
          variant="outline"
          size="md"
          className="p-2"
          disabled={activePage === totalPages || bulkDeleteLoading}
          onClick={() => setActivePage(activePage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function RenderPageNumbers({
  totalPages,
  currentPage,
  onPageClick,
  shouldDisable,
}) {
  const [screenSize, setScreenSize] = useState('desktop'); // mobile | tablet | desktop

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 768) setScreenSize('mobile');
      else if (window.innerWidth < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const createPageNumbers = () => {
    if (screenSize === 'mobile') {
      // Always show 3 numbers: current + up to 2 ahead
      if (totalPages <= 3)
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (currentPage <= 2) return [1, 2, 3];
      if (currentPage >= totalPages - 1)
        return [totalPages - 2, totalPages - 1, totalPages];
      return [currentPage, currentPage + 1, currentPage + 2];
    }

    const delta = screenSize === 'tablet' ? 1 : 2; // ±1 for tablet, ±2 for desktop
    const pages = [];

    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = createPageNumbers();

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      {pageNumbers.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageClick(page)}
            disabled={shouldDisable}
          >
            {page}
          </Button>
        )
      )}
    </div>
  );
}

export default TransactionTable;
