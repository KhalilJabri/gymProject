from rest_framework.pagination import PageNumberPagination

class SubscribersPagnation(PageNumberPagination):
    page_size = 20
    page_query_param = 'page'
    max_page_size = 20

    def get_paginated_response(self, data):
        return {
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'results': data  # Your paginated data
        }