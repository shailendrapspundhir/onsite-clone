if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/home/spsp/.gradle/caches/transforms-3/f0476c2d2bcc4be99cba0e2cf6fab795/transformed/hermes-android-0.72.6-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/spsp/.gradle/caches/transforms-3/f0476c2d2bcc4be99cba0e2cf6fab795/transformed/hermes-android-0.72.6-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

